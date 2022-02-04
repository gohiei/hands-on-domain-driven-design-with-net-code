module.exports = class ClassifiedAdTitle {
  title;

  constructor(title) {
    if (title === undefined || title.length > 100) {
      throw new Error('Title cannot be longer that 100 characters');
    }

    this.title = title;
  }

  static fromString(title) {
    ClassifiedAdTitle.checkValidity(title);

    return new ClassifiedAdTitle(title);
  }

  static fromHtml(htmlTitle) {
    const supportedTagsReplaced = htmlTitle
      .replace('<i>', '*')
      .replace('</i>', '*')
      .replace('<b>', '**')
      .replace('</b>', '**');

    const replacedTitle = supportedTagsReplaced.replace(/<.*?>/, '');

    ClassifiedAdTitle.checkValidity(replacedTitle);

    return new ClassifiedAdTitle(replacedTitle);
  }

  static checkValidity(value) {
    if (value.length > 100) {
      throw new RangeError('Title cannot be longer that 100 characters');
    }
  }

  toString() {
    return this.title;
  }
}
