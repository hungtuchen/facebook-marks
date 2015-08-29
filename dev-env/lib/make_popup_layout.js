export default function({webpackScript, bodyContent}) {
  const layout = `
<!DOCTYPE html>
<html>
  <head>
    <meta charSet="utf-8" />
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport" />
    <link href='http://fonts.googleapis.com/css?family=Roboto:400,300,500' rel='stylesheet' type='text/css'>
  </head>
  <body>
    ${bodyContent}
    ${webpackScript}
  </body>
</html>
`

  return layout;
}
