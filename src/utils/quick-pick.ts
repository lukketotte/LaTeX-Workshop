import * as vscode from 'vscode'
import { lw } from '../lw'

export async function pickRootPath(rootPath: string, subRootPath: string, verb: string): Promise<string | undefined> {
    const configuration = vscode.workspace.getConfiguration('latex-workshop', lw.file.toUri(rootPath))
    const doNotPrompt = configuration.get('latex.rootFile.doNotPrompt') as boolean
    if (doNotPrompt) {
        if (configuration.get('latex.rootFile.useSubFile')) {
            return subRootPath
        } else {
            return rootPath
        }
    }
    const pickedRootFile = await vscode.window.showQuickPick([{
        label: 'Default root file',
        description: `Path: ${rootPath}`
    }, {
        label: 'Subfiles package root file',
        description: `Path: ${subRootPath}`
    }], {
        placeHolder: `Subfiles package detected. Which file to ${verb}?`,
        matchOnDescription: true
    }).then( selected => {
        if (!selected) {
            return
        }
        switch (selected.label) {
            case 'Default root file':
                return rootPath
            case 'Subfiles package root file':
                return subRootPath
            default:
                return
        }
    })
    return pickedRootFile
}
