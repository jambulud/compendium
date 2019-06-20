function getContent(url) {
	return new Promise((resolve, reject) => {
		request(url, (error, response, body) => {
			console.log('response:' + response.body)
			if (error) reject(error);
			if ( response && response.statusCode === 200) {
                console.log(response.statusCode)
				resolve(body)
			} else {
				reject('error:' + url)
			}
		});
    });
}

getContent('http://help.websiteos.com/websiteos/example_of_a_simple_html_page.htm').then(res => console.log('res:' +res));