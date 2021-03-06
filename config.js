// const ENV = 'bingotest';
const ENV = 'dev';

var config = function(ENV){
	const config = {};
	config.ENV = ENV;
  config.photoDomain = 'https://www.jichuangtech.site/clothshopserver';
	switch(ENV){
		case 'dev':
      config.domain = 'https://www.jichuangtech.site/clothshopserver';
			break;
		case 'test':
      config.domain = 'http://106.15.179.23';
			break;
		case 'pro':
      break;
    case 'bingotest':
      // config.domain = 'http://172.20.10.3:8070';
      config.domain = 'http://localhost:8070';
      break;
		default:
			config.domain = 'https://www.ktvme.com';
			break;
	}
	return config;
}

module.exports = config(ENV);