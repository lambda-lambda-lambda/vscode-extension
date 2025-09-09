/**
 *  lambda-lambda-lambda/vscode-extension
 *  VS Code extension to create a new L³ application.
 *
 *  Copyright 2022-2025, Marc S. Brooks (https://mbrooks.info)
 *  Licensed under the MIT license:
 *  http://www.opensource.org/licenses/mit-license.php
 */

import {commands, window, workspace, ExtensionContext, Uri} from 'vscode';

import {createFile, createFiles} from '@lambda-lambda-lambda/cli';
import {AppConfig}               from '@lambda-lambda-lambda/types/cli';

// Local modules
import {InputBoxOpts, QuickPickOpts} from './types';

/*
 * Activate the VS Code extension.
 */
export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    createApp(),
    createResource('Middleware'),
    createResource('Route')
  );
}

/**
 * Create new L³ application options.
 */
function createApp() {
  return commands.registerCommand('lambda-lambda-lambda.createApp', async () => {
    const inputBoxTitle = 'L³: Create new application';

    // Prompt application values.
    const name: string | undefined = await promptInputBox({
      placeHolder: 'Application name (Example: restfulApiHandler)',
      title: inputBoxTitle,
      validateInput: value => {
        return (value && /^[a-zA-Z0-9]{1,40}$/.test(value))
          ? undefined : 'Alphanumeric characters, no spaces';
      },
      step: 1
    });

    const description: string | undefined = await promptInputBox({
      placeHolder: 'Description',
      title: inputBoxTitle,
      validateInput: value => {
        return (value && /^[\w-.,!? ]{1,100}$/.test(value))
          ? undefined : 'Alphanumeric characters, .,!? punctuation';
      },
      step: 2
    });

    const prefix: string | undefined = await promptInputBox({
      placeHolder: 'Request prefix (Example: /api)',
      title: inputBoxTitle,
      validateInput: value => {
        return (value && /^\/[\w-]{0,100}$/.test(value))
          ? undefined : 'Alphanumeric characters, must start with /';
      },
      step: 3
    });

    const asynchronous: boolean | undefined = (await promptQuickPick({
      placeHolder: 'Use asynchronous handler?',
      title: inputBoxTitle,
      items: [{label: 'Yes'}, {label: 'No'}],
      step: 4
    }) === 'Yes');

    const timeout: string | undefined = await promptInputBox({
      placeHolder: 'Function timeout (in seconds)',
      title: inputBoxTitle,
      validateInput: value => {
        return (value && /^[\d]{1,2}$/.test(value))
          ? undefined : 'Numbers only';
      },
      step: 5
    });

    const sdkVersion: string | undefined = await promptQuickPick({
      placeHolder: 'AWS SDK for JavaScript version',
      title: inputBoxTitle,
      items: [{label: '3'}, {label: '2'}],
      step: 6
    });

    const runtime: string | undefined = await promptQuickPick({
      placeHolder: 'Node.js Lambda runtime identifier',
      title: inputBoxTitle,
      items: [{label: 'nodejs22.x'}, {label: 'nodejs20.x'}, {label: 'nodejs18.x'}],
      step: 7
    });

    // Generate sources from templates.
    if (description && name && prefix && asynchronous && timeout && sdkVersion && runtime) {
      const appConfig: AppConfig = {
        description, name, asynchronous, prefix, timeout, sdkVersion, runtime
      };

      await createFiles(appConfig, getWorkspace());

      window.showInformationMessage('Created application sources.');
    } else {
      window.showErrorMessage('Failed to create application sources.');
    }
  });
}

/**
 * Create new L³ application resource.
 */
function createResource(type: string) {
  return commands.registerCommand(`lambda-lambda-lambda.create${type}`, async (uri: Uri) => {
    const inputBoxTitle = 'L³: Create new application resource';

    // Prompt application values.
    const name: string | undefined = await promptInputBox({
      placeHolder: `${type} name (Example: ${type === 'Route' ? 'Login' : 'BasicAuthHandler'})`,
      title: inputBoxTitle,
      validateInput: value => {
        return (value && /^[a-zA-Z0-9]{1,40}$/.test(value))
          ? undefined : 'Alphanumeric characters, no spaces';
      }
    });

    // Generate file from template.
    if (name) {
      await createFile(name, uri.path, getWorkspace());

      commands.executeCommand('workbench.files.action.refreshFilesExplorer');
    } else {
      window.showErrorMessage(`Failed to create ${type} resource`);
    }
  });
}

/**
 * Create a new InputBox instance.
 */
function promptInputBox(opts: InputBoxOpts): Promise<string | undefined> {
  return new Promise(resolve => {
    const inputBox = window.createInputBox();
    inputBox.placeholder = opts.placeHolder;
    inputBox.title       = opts.title;
    inputBox.value       = opts.value || '';
    inputBox.step        = opts.step;
    inputBox.totalSteps  = 5;

    // Handle events.
    inputBox.onDidAccept(() => {
      const value = inputBox.value;
      const error = opts.validateInput(value);

      if (error) {
        inputBox.validationMessage = error;
      } else {
        inputBox.hide();
        resolve(value);
      }
    });

    inputBox.show();
  });
}

/**
 * Create a new QuickPick instance.
 */
function promptQuickPick(opts: QuickPickOpts): Promise<string | undefined> {
  return new Promise(resolve => {
    const quickPick = window.createQuickPick();
    quickPick.placeholder = opts.placeHolder;
    quickPick.title       = opts.title;
    quickPick.items       = opts.items;
    quickPick.step        = opts.step;
    quickPick.totalSteps  = 5;

    // Handle events.
    quickPick.onDidChangeSelection(items => resolve(items[0].label));
    quickPick.onDidAccept(() => quickPick.dispose());
    quickPick.onDidHide(() => quickPick.dispose());

    quickPick.show();
  });
}

/**
 * Return the Workspace root path.
 */
function getWorkspace(): string {
  return (workspace.workspaceFolders)
    ? workspace.workspaceFolders[0].uri.fsPath : './';
}
