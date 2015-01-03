/* global require */

require({
    config: {
        tpl: {
            variable: 'data'
        }
    },
    shim: {
        bootstrap: ['jquery']
    }
}, ['./origins/main'], function(main) {

    // Run main passing in the options in the environment
    main(this.origins);

});
