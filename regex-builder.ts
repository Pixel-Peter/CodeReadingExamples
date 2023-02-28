export class RegexBuilder {
  regexSteps: Array<RegExp> = [];

  text(value: string) {
    this.regexSteps.push(new RegExp(value));
    return this;
  }

  variable() {
    this.regexSteps.push(/['"]([^'"]*?)["']/);
    return this;
  }


  ignoreUntil(value: string) {
    this.regexSteps.push(new RegExp('.*?' + value));
    return this;
  }

  rest() {
    this.regexSteps.push(new RegExp('(.*)'));
    return this;
  }

  optional(regex: RegExp | RegexBuilder | ((regexBuilder: RegexBuilder) => (RegExp | RegexBuilder)), asBinding = false) {
    if (typeof regex == 'function') {
      regex = regex(new RegexBuilder());
    }

    if (regex instanceof RegexBuilder) {
      regex = regex.build();
    }

    if (asBinding) {
      this.regexSteps.push(new RegExp(`((${regex.source})|)`));
    } else {
      this.regexSteps.push(new RegExp(`(${regex.source}|)`));
    }
    return this;
  }

  build() {
    return new RegExp(this.regexSteps.map(r => r.source).join(''));
  }
}
