var fs = require('fs'),
    readline = require('readline'),
    XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest,
    request = require('request');

module.exports = {
  funx : class {
    getPosts(user) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const url = 'https://allorigins.me/get?url=' + encodeURIComponent('https://instagram.com/' + user + '/')
        xhr.open("GET", url);
        xhr.onload = () => resolve(this.formatPosts(xhr.responseText, user));
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send();
      });
    }

    formatPosts(rawPosts, username) {
      let result = [];
      rawPosts = JSON.parse(rawPosts)
      try {
        rawPosts = JSON.parse(rawPosts.contents.split('window._sharedData = ')[1].split('\;\<\/script>')[0]).entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges
        rawPosts.forEach(function (item) {
          result.push({
            user : username,
            image: item.node.display_url,
            dimensions: item.node.dimensions,
            likes: item.node.edge_liked_by.count,
            video: item.node.is_video,
            code: item.node.shortcode,
            url: 'https://instagram.com/p/' + item.node.shortcode,
            timestamp: item.node.taken_at_timestamp
          })
        })
      } catch (e) {
        console.log(e)
      }
      return result;
    }

    readFile(path_to_file) {
      return new Promise((resolve, reject) => {
        let result = [],
        line_reader = readline.createInterface({
          input : fs.createReadStream(__dirname + path_to_file)
        })
        line_reader.on('line', (line) => {
          result.push(line)
        })
        line_reader.on('close', () => {
          resolve(result)
        })
      })
    }
    download(uri, filename, callback){
      return new Promise((resolve, reject) => {
        request.head(uri, function(err, res, body){
          console.log('content-type:', res.headers['content-type']);
          console.log('content-length:', res.headers['content-length']);
          request(uri).pipe(fs.createWriteStream(filename)).on('close', resolve);
        });
      })

    }
    sleep(ms) {
      return new Promise(resolve => {
        setTimeout(resolve, ms)
      })
    }

  },
  q : class {
    constructor() {
      this.supporting_array = []
    }
    enqueue(x) {
      this.supporting_array.push(x)
    }
    dequeue() {
      return this.supporting_array.shift()
    }
  }
}