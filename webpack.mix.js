let mix = require('laravel-mix');
require('laravel-mix-alias');

mix.js('assets/js/app.js', 'dist/');
mix.js('assets/js/settings.js', 'dist/');
mix.js('assets/js/apply-rules.js', 'dist/');
mix.alias({
  '@components' : 'assets/js/components'
});
mix.sass('assets/scss/app.scss', 'dist/');

