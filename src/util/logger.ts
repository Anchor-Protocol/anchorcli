import {
  bgBlueBright,
  bgYellow,
  white,
  bold,
  bgRedBright,
  redBright,
  blueBright,
  yellow,
  greenBright,
  bgGreenBright,
} from 'chalk';

export function info(text: string) {
  console.log(bold(white(bgBlueBright(' INFO '))) + ' ' + blueBright(text));
}

export function warn(text: string) {
  console.log(bold(white(bgYellow(' WARNING '))) + ' ' + yellow(text));
}

export function error(text: string) {
  console.log(bold(white(bgRedBright(' ERROR '))) + ' ' + redBright(text));
}

export function success(text: string) {
  console.log(
    bold(white(bgGreenBright(' SUCCESS '))) + ' ' + greenBright(text),
  );
}
