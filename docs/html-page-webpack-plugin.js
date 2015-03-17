import fs from 'fs';
import path from 'path';
import Root from './src/Root';

class HtmlPageGenerator {
  apply(compiler) {
    Root.getPages()
      .forEach(function (fileName) {
        let RootHTML = Root.renderToString({initialPath: fileName});

        fs.writeFileSync(path.join(__dirname, fileName), RootHTML);
      });
  }
}

export default HtmlPageGenerator;
