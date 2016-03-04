var React = require('react');
var Dropzone = require("./Dropzone");

var Media = React.createClass({
    displayName: "Media",
    getInitialState: function() {
        return { media: [], queue: [] };
    },
    
    componentDidMount: function() {
        var self = this;
        
        this.serverRequest = $.get('/api/media/index', function(data) {
           self.setState({media: data}); 
        });
    },
    
    componentWillUnmount: function() {
        this.serverRequest.abort();
    },
    
    onAddFile: function(res) {
        var queue = this.state.queue;
        queue.push({
            name:res.file.name,
            size: res.file.size, 
            file:res.file,
            url:res.imageUrl
        });
        
        this.setState({ queue: queue });
    },
    
    startUpload: function(e) {
        e.preventDefault();
        
        var self = this;
        var data = new FormData();
        $.each(this.state.queue, function(key, value) {
            data.append(key, value.file);
        });

        
        $.ajax({
            url: '/api/media/multiupload',
            type: 'POST',
            data: data,
            cache: false,
            dataType: 'json',
            processData: false, // Don't process the files
            contentType: false,
            success: function(data, textStatus, jqXHR) {
                var media = self.state.media;
                for (var i = 0; i < data.posts.length; i++) {
                    media.push(data.posts[i]);
                }
                
                self.setState({ queue: [], media: media });
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('ERRORS: ' + textStatus);
            }
        });
    },
    
    render: function() {
        return (<div>
            <h1 className="ui dividing header">MEDIA</h1>
            
            <div className="ui six cards">
            {this.state.queue.map(function(image) {
                return (
                    <div key={image.name} className="card">
                        <div className="image">
                           <img ref="img" src={image.url} width="120" height="120"/>
                        </div>
                        <div className="ui bottom attached button">
                            <i className="minus icon"></i>
                            Remove
                        </div>
                    </div>
                );
            })}
            </div>
            
            <Dropzone className="ui raised segment" onDrop={this.onAddFile}>
              <p>Drag &amp; drop files here or click here to browse for files.</p>
            </Dropzone>
            <button type="submit" onClick={this.startUpload} className="ui primary button">Upload</button>
            
            <div className="ui six cards">
                {this.state.media.map(function(image) {
                  return (
                    <div key={image._id} className="card">
                        <div className="image">
                           <img ref="img" src={'/uploads/small/' + image.additional.file_name} width="120" height="120"/>
                        </div>
                    </div>
                  );
                })}
            </div>
        </div>);
    }
});

module.exports = Media;