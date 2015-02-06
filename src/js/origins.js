/* global require */

require({
    config: {
        tpl: {
            variable: 'data'
        }
    },
    shim: {
        bootstrap: ['jquery']
    },
    paths: {
        marionette: 'backbone.marionette',
        flux: 'Flux'
    }
}, ['./origins/main'], function(main) {

    // Run main passing in the options in the environment
    main(this.origins);

});
