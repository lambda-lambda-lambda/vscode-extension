/**
 *  lambda-lambda-lambda/vscode-extension
 *  VS Code extension to create a new L³ application.
 *
 *  Copyright 2022-2024, Marc S. Brooks (https://mbrooks.info)
 *  Licensed under the MIT license:
 *  http://www.opensource.org/licenses/mit-license.php
 */

export interface InputBoxOpts {
  placeHolder: string,
  title: string,
  validateInput: {(value: string): string | undefined},
  value?: string,
  step?: number
}

export interface QuickPickItem {
  label: string
}

export interface QuickPickOpts {
  placeHolder: string,
  title: string,
  items: QuickPickItem[],
  step?: number
}
