
var numberUtils = {
    round: (value, decimals) => {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
    },
    calculatePercentageIncrease: (total, percentage, multiplier) => {
        var result = total;
        for (var i = 1; i <= multiplier; i++) {
            result += ((result / 100) * percentage);
        }

        return result;
    },
    totalOnKey: (keyName, results) => {
        var total = 0;
        Object.keys(results).forEach((outerKey, index) => {
            Object.keys(results[outerKey]).forEach((innerKey, index) => {
                if (innerKey === keyName) {
                    total += results[outerKey][innerKey];
                }
            })
        });
        return total;
    }
};

module.exports = numberUtils;