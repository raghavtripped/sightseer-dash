// Node script to extract visible UI strings from TS/TSX React code and output a Markdown inventory
// Usage: node scripts/extract-texts.mjs
// Output: docs/ui-copy-inventory.md

import fs from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';
import ts from 'typescript';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');
const docsDir = path.join(projectRoot, 'docs');
const outputFile = path.join(docsDir, 'ui-copy-inventory.md');

// Attribute/property names likely to map to visible text
const visibleAttributeNames = new Set([
  'title', 'subtitle', 'description', 'label', 'placeholder', 'alt', 'aria-label', 'ariaDescription', 'ariaTitle',
  'content', 'helperText', 'successText', 'errorText', 'emptyText', 'toast', 'tooltip', 'aria-describedby', 'aria-labelledby',
]);

const visibleObjectPropertyNames = new Set([
  'title', 'subtitle', 'description', 'label', 'name', 'when', 'who', 'what', 'severity', 'entity', 'auto', 'status', 'message',
  'cta', 'ctaText', 'emptyText', 'helperText', 'placeholder', 'badge', 'persona', 'path', 'text'
]);

const fileExtensions = new Set(['.tsx', '.ts']);

/**
 * Recursively find all TS/TSX files under a directory
 */
async function findSourceFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await findSourceFiles(full));
    } else if (fileExtensions.has(path.extname(entry.name))) {
      files.push(full);
    }
  }
  return files;
}

/**
 * Create a source file AST using TypeScript compiler API
 */
function createSourceFile(filePath, contents) {
  const scriptKind = path.extname(filePath) === '.tsx' ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  return ts.createSourceFile(filePath, contents, ts.ScriptTarget.Latest, true, scriptKind);
}

/**
 * Extract route mapping from src/App.tsx: path -> component file path
 */
function buildRouteMap(appSourceFile, allFiles) {
  // Map import local name -> resolved file path
  const importNameToFile = new Map();

  function resolveImport(importPath, fromFile) {
    if (!importPath.startsWith('.')) return null;
    const base = path.resolve(path.dirname(fromFile), importPath);
    const candidates = [
      `${base}.tsx`, `${base}.ts`, path.join(base, 'index.tsx'), path.join(base, 'index.ts')
    ];
    for (const c of candidates) {
      if (allFiles.includes(c)) return c;
    }
    return null;
  }

  appSourceFile.forEachChild(node => {
    if (ts.isImportDeclaration(node) && node.importClause && node.importClause.name && ts.isStringLiteral(node.moduleSpecifier)) {
      const localName = node.importClause.name.getText();
      const modulePath = node.moduleSpecifier.text;
      const resolved = resolveImport(modulePath, appSourceFile.fileName);
      if (resolved) importNameToFile.set(localName, resolved);
    }
  });

  const routePathToFile = new Map();

  function scanRoutes(node) {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tagName = node.tagName.getText();
      if (tagName === 'Route') {
        let pathValue = null;
        let elementComponentName = null;
        for (const attr of node.attributes.properties) {
          if (ts.isJsxAttribute(attr) && attr.name.text === 'path' && attr.initializer && ts.isStringLiteral(attr.initializer)) {
            pathValue = attr.initializer.text;
          }
          if (ts.isJsxAttribute(attr) && attr.name.text === 'element' && attr.initializer && ts.isJsxExpression(attr.initializer) && attr.initializer.expression) {
            const expr = attr.initializer.expression;
            // element={<Component />}
            if (ts.isJsxElement(expr)) {
              const opening = expr.openingElement;
              elementComponentName = opening.tagName.getText();
            } else if (ts.isJsxSelfClosingElement(expr)) {
              elementComponentName = expr.tagName.getText();
            }
          }
        }
        if (pathValue && elementComponentName && importNameToFile.has(elementComponentName)) {
          routePathToFile.set(pathValue, importNameToFile.get(elementComponentName));
        }
      }
    }
    ts.forEachChild(node, scanRoutes);
  }

  ts.forEachChild(appSourceFile, scanRoutes);
  return routePathToFile;
}

/**
 * Utility to get line number for a node
 */
function getLineOfNode(sourceFile, node) {
  const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
  return line + 1;
}

/**
 * Extract visible strings from a TS/TSX source file AST
 */
function extractStringsFromSource(sourceFile) {
  const strings = [];

  function add(text, context) {
    const trimmed = (text ?? '').replace(/\s+/g, ' ').trim();
    if (!trimmed) return;
    strings.push({ text: trimmed, context });
  }

  function isLikelyNonVisibleImportLiteral(node) {
    return ts.isStringLiteral(node) && ts.isImportDeclaration(node.parent);
  }

  function isClassNameAttr(attrName) {
    return attrName === 'class' || attrName === 'className';
  }

  function visit(node) {
    // JSX text nodes
    if (ts.isJsxText(node)) {
      const parentTag = node.parent && (ts.isJsxElement(node.parent) ? node.parent.openingElement.tagName.getText() : ts.isJsxFragment(node.parent) ? 'Fragment' : 'JSX');
      add(node.text, `${parentTag} @${getLineOfNode(sourceFile, node)}`);
    }

    // JSX attribute string values for visible attrs
    if (ts.isJsxAttribute(node) && node.initializer && ts.isStringLiteral(node.initializer)) {
      const name = node.name.text;
      if (!isClassNameAttr(name) && (visibleAttributeNames.has(name) || name.startsWith('aria-'))) {
        add(node.initializer.text, `attr ${name} @${getLineOfNode(sourceFile, node)}`);
      }
    }

    // Object literals with visible property names
    if (ts.isPropertyAssignment(node) && ts.isIdentifier(node.name) && ts.isStringLiteral(node.initializer)) {
      const key = node.name.text;
      if (visibleObjectPropertyNames.has(key)) {
        add(node.initializer.text, `prop ${key} @${getLineOfNode(sourceFile, node)}`);
      }
    }

    // toast({ title: '', description: '' }) and sonner toast
    if (ts.isCallExpression(node)) {
      const calleeText = node.expression.getText();
      const isToast = calleeText === 'toast' || /\btoast$/.test(calleeText);
      if (isToast) {
        for (const arg of node.arguments) {
          if (ts.isObjectLiteralExpression(arg)) {
            for (const prop of arg.properties) {
              if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name) && ts.isStringLiteral(prop.initializer)) {
                const key = prop.name.text;
                if (visibleObjectPropertyNames.has(key)) {
                  add(prop.initializer.text, `toast.${key} @${getLineOfNode(sourceFile, prop)}`);
                }
              }
            }
          } else if (ts.isStringLiteral(arg)) {
            add(arg.text, `toast @${getLineOfNode(sourceFile, arg)}`);
          }
        }
      }
    }

    // Avoid import string literals
    if (isLikelyNonVisibleImportLiteral(node)) {
      return;
    }

    ts.forEachChild(node, visit);
  }

  ts.forEachChild(sourceFile, visit);
  return strings;
}

/**
 * Group strings by route based on file path
 */
function groupByRoute(stringsByFile, routeMap) {
  const byRoute = new Map(); // route -> { files: Map<file, strings[]> }
  const shared = new Map(); // file -> strings[]

  const fileToRoute = new Map();
  for (const [routePath, filePath] of routeMap.entries()) {
    fileToRoute.set(filePath, routePath);
  }

  for (const [filePath, strings] of stringsByFile.entries()) {
    const routePath = fileToRoute.get(filePath);
    if (routePath) {
      if (!byRoute.has(routePath)) byRoute.set(routePath, new Map());
      const filesMap = byRoute.get(routePath);
      filesMap.set(filePath, strings);
    } else {
      shared.set(filePath, strings);
    }
  }

  return { byRoute, shared };
}

function dedupeAndSort(strings) {
  const seen = new Set();
  const out = [];
  for (const s of strings) {
    const key = s.text;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(s);
    }
  }
  out.sort((a, b) => a.text.localeCompare(b.text));
  return out;
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function main() {
  const allFiles = await findSourceFiles(srcDir);
  const fileContents = new Map();
  await Promise.all(allFiles.map(async (f) => {
    const c = await fs.readFile(f, 'utf8');
    fileContents.set(f, c);
  }));

  const appPath = path.join(srcDir, 'App.tsx');
  const appSource = createSourceFile(appPath, fileContents.get(appPath) ?? '');
  const routeMap = buildRouteMap(appSource, allFiles);

  const stringsByFile = new Map();

  for (const [filePath, contents] of fileContents.entries()) {
    const source = createSourceFile(filePath, contents);
    const strings = extractStringsFromSource(source);
    if (strings.length > 0) stringsByFile.set(filePath, strings);
  }

  const { byRoute, shared } = groupByRoute(stringsByFile, routeMap);

  // Build markdown
  let md = '';
  md += '## UI Copy Inventory\n\n';
  md += `Generated at: ${new Date().toISOString()}\n\n`;
  md += '**Note**: This inventory aggregates static strings detected in JSX text, common visible attributes, Helmet titles/meta, toast calls, and select object properties. Dynamic data computed at runtime may not be fully captured.\n\n';

  // Routes section
  md += '### Routes\n\n';
  const sortedRoutes = [...byRoute.keys()].sort();
  for (const routePath of sortedRoutes) {
    md += `#### ${routePath}\n\n`;
    const filesMap = byRoute.get(routePath);
    const fileList = [...filesMap.keys()].sort();
    for (const filePath of fileList) {
      const rel = path.relative(projectRoot, filePath);
      const deduped = dedupeAndSort(filesMap.get(filePath));
      if (deduped.length === 0) continue;
      md += `- **file**: \n\n\`\`\`\n${rel}\n\`\`\`\n`;
      for (const s of deduped) {
        md += `  - ${s.text}\n`;
      }
      md += '\n';
    }
  }

  // Shared components / other files
  md += '### Shared Components and Other Files\n\n';
  const sharedFiles = [...shared.keys()].sort();
  for (const filePath of sharedFiles) {
    const rel = path.relative(projectRoot, filePath);
    const deduped = dedupeAndSort(shared.get(filePath));
    if (deduped.length === 0) continue;
    md += `- **file**: \n\n\`\`\`\n${rel}\n\`\`\`\n`;
    for (const s of deduped) {
      md += `  - ${s.text}\n`;
    }
    md += '\n';
  }

  await ensureDir(docsDir);
  await fs.writeFile(outputFile, md, 'utf8');
  // eslint-disable-next-line no-console
  console.log(`Wrote ${outputFile}`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
