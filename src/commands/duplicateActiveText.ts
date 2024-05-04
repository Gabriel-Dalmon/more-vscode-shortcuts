import * as vscode from 'vscode';

//-------------------------------------------------------------------------------------
export function duplicateActiveTextCommand() {
    const editor = vscode.window.activeTextEditor;
    if(editor === undefined) {
        return;
    }

    // Only duplicate the line the cursor is on if there is no selection.
    if(editor.selection.isEmpty) {
        duplicateLine(editor);
    } else {
        duplicateSelection(editor);
    }
}

//-------------------------------------------------------------------------------------
function duplicateLine(editor: vscode.TextEditor) {
    // Init editor state description.
    const cursorPosition = editor.selection.active;
    const characterIndex = cursorPosition.character;
    const lineIndex = cursorPosition.line;
    const lineCount = editor.document.lineCount;
    const isLastLine = lineIndex === lineCount - 1;
    
    // Add the duplicated line below the current line.
    let [prefix, suffix] = isLastLine ? ['\n', ''] : ['', '\n'];
    const lineContent = editor.document.lineAt(cursorPosition.line).text;
    editor.edit(editBuilder => {
        editBuilder.insert(
            new vscode.Position(lineIndex+1, 0), 
            prefix + lineContent + suffix
        );
    });
    
    // Reset the cursor position if it was moved to the next line.
    if(isLastLine === false) {
        return;
    }
    const previousPosition = new vscode.Position(lineIndex, characterIndex);
    editor.selection = new vscode.Selection(previousPosition, previousPosition);

}

//-------------------------------------------------------------------------------------
function duplicateSelection(editor: vscode.TextEditor) {
    // Init editor state description.
    const selection = editor.selection;
    const selectionContent = editor.document.getText(selection);
    const selectionEnd = selection.end;
    const lineIndex = selectionEnd.line;
    const lineCount = editor.document.lineCount;
    const isLastLine = lineIndex === lineCount - 1;

    // Add the duplicated selection below the current selection.
    let [prefix, suffix] = isLastLine ? ['\n', ''] : ['', '\n'];
    editor.edit(editBuilder => {
        editBuilder.insert(
            new vscode.Position(selectionEnd.line + 1,0),
            prefix + selectionContent + suffix
        );
    });
    
    // Reset the cursor position if it was moved to the next line.
    if(isLastLine === false) {
        return;
    }
    const previousSelectionEnd = new vscode.Position(lineIndex, selectionEnd.character);
    editor.selection = new vscode.Selection(selection.start, previousSelectionEnd);    
}