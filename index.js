const csv= require('csv-parser');

const results= [];

var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
const mv = require('mv');

http
  .createServer(function (req, res) {
    if (req.url == '/fileupload') {
      var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
        var oldpath = files.filetoupload.filepath;
        fs.createReadStream(oldpath)
          .pipe(csv({}))
          .on('data', (data) => results.push(data))
          .on('end', () => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write('<h1> Output from CSV file </h1>');
            res.write('<table border="1"> <tr> <th> Product Line </th> <th> Territory </th> <th> Quantity Ordererd </th </tr>')
            results.forEach(result=>{
                
                if(result.YEAR_ID == '2004'){
                    // console.log(result.TERRITORY, ' :- ' , result.PRODUCTLINE, :- , result.QUANTITYORDERED)
                    res.write(
                        `
                        <tr>
                          <td>${result.PRODUCTLINE}</td>
                          <td>${result.TERRITORY}</td>
                          <td>${result.QUANTITYORDERED}</td>
                        </tr>
                        `
                    );
                    
                }
            })
            res.write('</table>');
            return res.end();
          });
      });
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(
        '<form action="fileupload" method="post" enctype="multipart/form-data">'
      );
      res.write('<input type="file" name="filetoupload"><br>');
      res.write('<input type="submit">');
      res.write('</form>');
      return res.end();
    }
  })
  .listen(8080);
