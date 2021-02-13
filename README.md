# hexo-tag-injector

Inject scripts or stylesheets only for posts with tags.

## Usage
```js
const css = hexo.extend.helper.get('css').bind(hexo);
const Injector = require("hexo-tag-injector")
const injector = new Injector(hexo);
hexo.extend.tag.register("some-tag", function(args){
	var content = some_func();
	return injector.mark(content);
}
injector.register("head_end", css("css/some_stylesheet.min.css"));
```

