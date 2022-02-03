module.exports = class ClassifiedAdText {
  text;

  constructor(text) {
    if (text === undefined || text.length > 100) {
      throw new Error('Text cannot be longer that 100 characters');
    }

    this.text = text;
  }

  static fromString(text) {
    return new ClassifiedAdText(text);
  }

  static fromHtml(htmlText) {
    const supportedTagsReplaced = htmlText
      .replace('<i>', '*')
      .replace('</i>', '*')
      .replace('<b>', '**')
      .replace('</b>', '**');

    return new ClassifiedAdText(supportedTagsReplaced.replace(/<.*?>/, ''));
  }
}
