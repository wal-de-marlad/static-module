const
   URL      = require( 'url'     ),
   FS       = require( 'fs'      ),
   MIME     = require( '../mime' ),

   PUBLIC   = process.env.npm_package_config_public,
   INDEX    = '/' + process.env.npm_package_config_index,

   OK       = 200,
   NOTFOUND = 404,
      
   SUCC     = 'File %s (length: %d B)" successfully served.',
   FAIL     = 'File %s not found, status %d served.';

module.exports = function( req, res ) {
   let
      page = URL.parse( req.url ).pathname,
      file = ( page === '/' ) ? INDEX : page,
      path = PUBLIC + file;
      
   FS.access( path, FS.constants.R_OK, ( error ) => {
      if ( !error ) {
         FS.stat( path, ( error, stats ) => {
            if ( !error ) {
               stream = FS.createReadStream( path ),
               type   = MIME.lookup( path );
               res.writeHead( OK, {
                  'Content-Length': stats.size,
                  'Content-Type':   type
               });
               stream.pipe( res );
               console.log( SUCC, file, stats.size );
            } else {
               res.statusCode = NOTFOUND;
               res.end();
               console.log( FAIL, file, NOTFOUND );
            };
         });
      } else {
         res.statusCode = NOTFOUND;
         res.end();
         console.log( FAIL, file, NOTFOUND );
      };
   });
};
