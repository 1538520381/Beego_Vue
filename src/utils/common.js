export function sleep(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay));
}

export function isEmpty(field) {
    return field === null || field === undefined || field === '' || JSON.stringify(field) === '[]' || JSON.stringify(field) === '{}';
}

export function markdownSpecialCharacterReplace(text) {
    if (isEmpty(text)) {
        return ""
    }

    let specialCharacter = {
        '→': '->', '×': '\\times', '·': '\\cdot', '\\implies': '\\Rightarrow '
    }
    for (let key in specialCharacter) {
        text = text.replaceAll(key, specialCharacter[key])
    }
    return text
}

export function latexToMarkdown(text) {
    if (isEmpty(text)) {
        return "";
    }

    let inlineLatex = /\\\((.*?)\\\)/gs;
    let blockLatex = /\\\[(.*?)\\\]/gs;

    text = text.replace(inlineLatex, (match, p1) => ` $${!isEmpty(p1) ? p1.trim() : p1}$ `);
    text = text.replace(blockLatex, (match, p1) => `\n$$\n${!isEmpty(p1) ? p1.trim() : p1}\n$$\n`)
    return text
}

export function getQueryString(name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    let r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    }
    return null;
}