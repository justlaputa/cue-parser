/**
 * parse one line of cue sheet, and return COMMAND
 * and all parameters
 */

export function parseCommand(line) {
    var matcher = /^([A-Z]+)\s+(.*)$/,
    result,
    command,
    params;

    line = line.trim();

    result = line.match(matcher);

    if (result) {

        command = result[1];
        params = parseParams(result[2]);

    } else {
        throw new Error('Not a command: ' + line);
    }

    if (!command) {
        throw new Error('Can not parse command from ' + line);
    }

    if (!params) {
        throw new Error('Can not parse parameters from ' + line);
    }

    return {
        command: command,
        params: params
    };
}

function parseParams(lineString) {
    var params = [],
    quoteIndex;

    if (lineString[0] === '"') {
        quoteIndex = lineString.indexOf('"', 1);
        params.push(lineString.substring(1, quoteIndex));
        lineString = lineString.substring(quoteIndex + 1).trim();
    }

    if (lineString !== '') {
        params = params.concat(lineString.split(' '));
    }

    return params;
}