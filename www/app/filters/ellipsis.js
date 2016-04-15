angular.module("leaguesApp").filter("ellipsis", function () {
    _maxlength = 13;
    return function (input, maxlength) {
        if (!maxlength)
            maxlength = _maxlength;

        if (input.length <= maxlength)
        {
        	while (input.length < maxlength)
        		input = input + "x";

           return input;
        }	
        else
            return input.substring(0, maxlength);
    }
});