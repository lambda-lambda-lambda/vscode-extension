/**
 *  vscode-lambda-lambda-lambda
 *  VS Code extension to create a new L³ application.
 *
 *  Copyright 2022, Marc S. Brooks (https://mbrooks.info)
 *  Licensed under the MIT license:
 *  http://www.opensource.org/licenses/mit-license.php
 */

import {window, workspace, Uri, WorkspaceEdit} from 'vscode';
import {camelCase, pascalCase} from 'change-case';
import {renderFile} from 'template-file';

import * as fs   from 'fs';
import * as path from 'path';

export interface AppConfig {
  description: string,
  name: string,
  prefix: string,
  timeout: string
}

interface TemplateVars {
  appBaseDir: string,
  appDescription: AppConfig['description'],
  appName: AppConfig['name'],
  appPrefix: AppConfig['prefix'],
  appTimeout: AppConfig['timeout'],
  cfResourceName: string,
  routePath: string
};

/**
 * Generate app sources from templates.
 */
export async function createFiles(appConfig: AppConfig, extPath: string) {
  const templates = `${extPath}/templates`;
  const manifest  = `${templates}/MANIFEST`;

  const appName = camelCase(appConfig.name);

  const vars: TemplateVars = {
    appBaseDir: appName,
    appDescription: appConfig.description,
    appName: appName,
    appPrefix: appConfig.prefix   || '/',
    appTimeout: appConfig.timeout || '3',
    cfResourceName: pascalCase(appName),
    routePath: 'example'
  };

  const manFiles: string[] = (await renderFile(manifest, {...vars})).split(/\r?\n/);
  const tplFiles: string[] = fs.readdirSync(templates);

  for (let tplFile of tplFiles) {
    const outFile: string | undefined = getFsPath(manFiles, tplFile);

    if (outFile) {
      const outDir = path.dirname(outFile);

      // Select template based on type.
      if (isMiddleware(outFile)) {
        tplFile = `${templates}/middleware.js`;
      } else if (isRoute(outFile)) {
        tplFile = `${templates}/route.js`;
      } else {
        tplFile = `${templates}/${tplFile}`;
      }

      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, {recursive: true});
      }

      const content: string = await renderFile(tplFile, {...vars});
      fs.writeFileSync(outFile, content, 'utf8');

      const wsedit = new WorkspaceEdit();
      wsedit.createFile(Uri.parse(outFile), {ignoreIfExists: true});

      workspace.applyEdit(wsedit);
    }
  }

  window.showInformationMessage('Created application sources.');
}

/**
 * Return output path for a given file.
 */
function getFsPath(files: string[], cmpFile: string): string | undefined {
  const outPath = getWorkspace();

  if (outPath) {
    for (const file of files) {
      const regex = new RegExp(`\/${path.parse(cmpFile).name}`);

      if (regex.test(file) || path.basename(file) === cmpFile) {
        return `${outPath}/${file}`;
      }
    }
  }
}

/**
 * Return the Workspace root path.
 */
function getWorkspace(): string | undefined {
  return (workspace.workspaceFolders)
    ? workspace.workspaceFolders[0].uri.fsPath: undefined;
}

/**
 * Check for middleware output path.
 */
function isMiddleware(path: string): boolean {
  return !!/\/src\/middleware/.test(path);
}

/**
 * Check for route output path.
 */
function isRoute(path: string): boolean {
  return !!/\/src\/routes/.test(path);
}
