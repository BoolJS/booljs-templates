'use strict';

module.exports = class FilterFallback {
    execute (value, _default) {
        if (value !== undefined) {
            if (value === 'undefined') {
                return undefined;
            }

            if (value === 'null') {
                return null;
            }

            if (value === 'true') {
                return true;
            }

            if (value === 'false') {
                return false;
            }

            if (_.isString(value)) {
                return value;
            }

            if (!_.isNaN(value)) {
                return Number(value);
            } else {
                return _default;
            }
        } else {
            return _default;
        }
    }
};
