const vscode = require('vscode');
var path = require("path");
const dotenv = require('dotenv')

function activate(context) {
    vscode.commands.registerCommand('extension.format-env', () => {
        const { activeTextEditor } = vscode.window;
        const filename = path.basename(activeTextEditor.document.fileName);
        if (!filename.includes('.env')) { return }

        const { document } = activeTextEditor;
        const buf = Buffer.from(document.getText());
        const config = dotenv.parse(buf);
        const edit = new vscode.WorkspaceEdit();

        for (let i = 0; i < document.getText().split('\n').length; i++) {
            let line = document.lineAt(i);
            if (line.b == '') {
                continue
            }

            let varName = line.b.split('=')[0]
            let value = config[varName]
            if (value === undefined) {
                continue
            }

            if (!value.includes('\n')) {
                continue
            }
            let len = value.split('\n').length
            
            let range = new vscode.Range(line.range.start, document.lineAt(i+len-1).range.end)
            edit.replace(document.uri, range, `${varName}='${value.replaceAll('\n', '')}'`)
        }

        edit
        return vscode.workspace.applyEdit(edit);
    });

    // context.subscriptions.push(
    //     vscode.languages.registerDocumentFormattingEditProvider({scheme: 'file', pattern: '*.env*'}, {
    //         provideDocumentFormattingEdits(document) {
    //             const firstLine = document.lineAt(0);
    //             if (firstLine.text !== '42') {
    //                 return [vscode.TextEdit.insert(firstLine.range.start, '42\n')];
    //             }
    //         }
    //     });
    // )
}

module.exports = { activate };
