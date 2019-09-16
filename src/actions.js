export const FILETEXT = 'FILETEXT';

export const receiveFileText = f => {
    return {
        type: FILETEXT,
        fileText: f
    };
}