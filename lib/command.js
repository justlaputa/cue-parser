/**
 * parse one line of cue sheet, and return COMMAND
 * and all parameters
 */

var matchers = {
    command: /^([A-Z]+)\s+(.*)$/
};

module.exports = function(line) {
    var command, params, result;

    line = line.trim();

    result = line.match(matchers.command);

    if (result) {
        command = result[1];
        params = result[2];

        console.log('command: ', command);
        console.log('params:  ', params);
    } else {
        throw new Error('Not a command: ' + line);
    }
}