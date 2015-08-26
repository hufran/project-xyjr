
_.mixin

    # Angular Inject
    ai: (params, func, result = params.replace(/@|,/g, '')) ->
        _.split(result).concat func

    split: (string) ->
        string.trim().match(/\S+/g) or []

    fixed: (digits, num) ->
        parseFloat (+num or 0).toFixed digits

    fixed_in_2: (num) ->
        _.fixed 2, num
