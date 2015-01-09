/* global define */

define([
    'react'
], function(React) {

    var Title = React.createClass({
        render: function() {
            return (
                <div>
                    <h1>Data provenance for the rest of us.</h1>

                    <p className='lead'>Origins is an <a href="https://github.com/cbmi/origins">open source</a> service for modeling data, workflow, or project topologies by <em>leveraging</em> <a href="http://en.wikipedia.org/wiki/Provenance#Data_provenance">data provenance</a>.
                    </p>
                </div>
            );
        }
    });


    // This is currently not shown
    var ScreenCastButton = React.createClass({
        render: function() {
            return (
                <p>
                    <button className='btn btn-primary'>
                        <i className='fa fa-play-circle'></i>
                        Watch an 118 Second Screencast
                    </button>
                </p>
            );
        }
    });


    var FirstFeatureBlock = React.createClass({
        render: function() {
            return (
                <div className='col-md-4 col-sm-4 col-xs-4'>
                    <h4><i className='fa fa-database'></i> Import Resources</h4>

                    <p>Import entities and provenance data from a variety of commonly used files, systems, and services into a simple uniform model.</p>
                </div>
            );
        }
    });


    var SecondFeatureBlock = React.createClass({
        render: function() {
            return (
                <div className='col-md-4 col-sm-4 col-xs-4'>
                    <h4><i className='fa fa-link'></i> Create Topologies</h4>

                    <p>Link entities across resources to model how your data, systems, and operations are logically connected.</p>
                </div>

            );
        }
    });


    var ThirdFeatureBlock = React.createClass({
        render: function() {
            return (
                <div className='col-md-4 col-sm-4 col-xs-4'>
                    <h4><i className='fa fa-calendar'></i> Track Changes</h4>

                    <p>Resources rarely stay static. Get notified when something changes so you can assess how it affects your topologies.</p>
                </div>
            );
        }
    });


    var IndexPage = React.createClass({
        render: function() {
            return (
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col-md-10 col-md-offset-1'>
                            <div className='text-center block block-padding'>
                                <Title />

                                <hr />

                                <div className='row'>
                                    <FirstFeatureBlock />
                                    <SecondFeatureBlock />
                                    <ThirdFeatureBlock />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    });

    return {
        IndexPage: React.createFactory(IndexPage)
    };

});
