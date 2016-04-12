var React = require("react");
var ReactDOM = require("react-dom");

var Dropzone = require("./common/Dropzone");
var ClassifierDropdown = require("./common/ClassifierDropdown");
var axios = require('axios');
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

var MediaItem = React.createClass({
    getInitialState: function() {
        return {
            _id: null,
            title: "",
            url: "",
            thumbnail: {},
            category: "",
            tags: []
        };
    },
   
    componentDidMount: function() {
        this.setState({ 
            _id: this.props.image._id,
            title: this.props.image.title,
            category: this.props.image.category,
            url: "/uploads/thumbnail/" + this.props.image.additional.file_name
        });
    },
    
    handleSubmit: function() {
        var self = this;
        var data = new FormData();
        
        data.append("_id", self.state._id);
        data.append("title", self.state.title);
        data.append("category", self.state.category);
        data.append("tags", self.state.tags);
        data.append("thumbnail", self.state.thumbnail.file);
        
        $.ajax({
            url: '/api/media/media_form',
            type: 'POST',
            data: data,
            cache: false,
            dataType: 'json',
            processData: false, // Don't process the files
            contentType: false,
            success: function(data, textStatus, jqXHR) {
                if (self.state.thumbnail && self.state.thumbnail.imageUrl)
                    self.setState({ url: self.state.thumbnail.imageUrl });
                
                if (data.upserted && $.isFunction(self.props.callbackParent))
                    self.props.callbackParent({ reload: true });
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('ERRORS: ' + textStatus);
            }
        });
    },
    
    handleTitleChange: function(e) {
        this.setState({ title: e.target.value });  
    },
    
    handleCategoryChange: function(e) {
        this.setState({ category: e.target.value });
    },
    
    handleTagChange: function(e) {
        var dom = ReactDOM.findDOMNode(e.target);
        
        this.setState({ tags: $(dom).val() });
    },
    
    onAddFile: function(e) {
        e.preventDefault();
        var self = this;
        
        var file = null;
        if (e.dataTransfer && e.dataTransfer.files.length > 0) {
            file = e.dataTransfer.files[0];
        } else if (e.target.files && e.target.files.length > 0) {
            file = e.target.files[0];
        }
        
        var reader = new FileReader();
        reader.onloadend = function(e) {
            var res = {file:file, imageUrl:e.target.result};
            
            self.setState({ thumbnail: res });
        };
        reader.readAsDataURL(file);
    },
   
    render: function() {
        return (
            <div className="card">
                <div className="image">
                   <img ref="img" src={this.state.url} width="120" height="120"/>
                </div>
                <div className="content">
                    <form className="ui form">
                        <input type="text" placeholder="Title" value={this.state.title} onChange={this.handleTitleChange} />
                        
                        <div className="field">
                            <ClassifierDropdown placeholder="Category" value={this.state.category} field="category" onChange={this.handleCategoryChange} multiple={false} />
                        </div>
                        
                        <div className="field">
                            <ClassifierDropdown placeholder="Tags" field="tags" onChange={this.handleTagChange} multiple={true} />
                        </div>
                        
                        <div className="field">
                            <label>Custom Thumbnail</label>
                            <input type="file" ref="fileInput" onChange={this.onAddFile} />
                        </div>
                    </form>
                </div>
                <div className="ui bottom attached primary button" onClick={this.handleSubmit}>
                    Submit
                </div>
            </div>
        );
    }
});

var Media = React.createClass({
    displayName: "Media",
    getInitialState: function() {
        return { media: [], queue: [], 
            classifiers: {
                tag: [],
                category: []
            } 
        };
    },
    
    getChildContext: function() {
        return { classifiers: this.state.classifiers };
    },
    
    childContextTypes: {
        classifiers: React.PropTypes.object
    },
    
    onChildChanged: function(newState) {
        var self = this;
        if (newState.reload) {
            this.serverRequest();
        }
    },
    
    serverRequest: function() {
        var self = this;
        
        function getIndex() {
            return axios.get('/api/media/index');
        }
        
        function getClassifiers() {
            return axios.get('/api/posts/getClassifiers', {
                params: { field: "both" }
            });
        }
        
        return axios.all([getIndex(), getClassifiers()]).then(axios.spread(function(index, classifiers) {
            self.setState({ media: index.data, classifiers: classifiers.data });
        }));
    },
    
    componentDidMount: function() {
        var self = this;
        
        self.serverRequest();
    },
    
    componentWillUnmount: function() {
        //this.serverRequest.abort();
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
        var self = this;
        
        return (<div>
            <h1 className="ui dividing header">MEDIA</h1>
            
            <div className="ui six cards">
            {this.state.queue.map(function(image) {
                return (
                    <div key={image.name} className="card">
                        <div className="image">
                            <img ref="img" src={image.url} width="120" height="120"/>
                        </div>
                        <div className="content"></div>
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
                    <MediaItem key={image._id} image={image} callbackParent={self.onChildChanged} />
                  );
                })}
            </div>
        </div>);
    }
});

module.exports = Media;