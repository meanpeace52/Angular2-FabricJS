import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { Observable } from "rxjs/Rx";

// const api_url = 'http://localhost:8080/api';
const api_url = 'http://ec2-54-67-13-118.us-west-1.compute.amazonaws.com:8080/api';

@Injectable()

export class HttpService {
	public headers: Headers;

	constructor(private http:Http) {
		this.headers = new Headers({ 'Content-type': 'application/json' });
	}

	getProfileInfo(token) {
		this.headers.append('token', token);

		return this.http.get(api_url+'/me', {headers: this.headers})
				.map(res => res.json())		
	}

	updateProfile(params) {
		return this.http.put(api_url+'/user/update', params, {headers: this.headers})
				.map(res => res.json())
	}

	uploadAddressers(formData:FormData) {
		return this.http.post(api_url+'/card/uploadAddressers', formData)
				.map(res => res.json())
	}

	authCimpress() {
		var cimpress_auth = JSON.stringify({
	        "client_id": "4GtkxJhz0U1bdggHMdaySAy05IV4MEDV",
			"username":"info@square1grp.com",
			"password":"Admin123#@$",
			"connection":"default",
			"device":"none",
			"scope": "openid email app_metadata"
	    });

		return this.http.post('https://cimpress.auth0.com/oauth/ro', cimpress_auth, {headers: this.headers})
			.map(res => res.json())
	}

	createDocumentOnCimpress(token) {
		var document_body = JSON.stringify({
			"Sku": "string",
			"ImageUrls": [
				"https://s3-us-west-1.amazonaws.com/agent-cloud/cimpress/business1-front.jpg"
			],
			"ScaleType": "ScaleToFit"
		});

		this.headers.append('Authorization','Bearer '+token);
		return this.http.post('https://api.cimpress.io/sandbox/vcs/printapi/v2/documents/creators/url', document_body, {headers: this.headers})
			.map(res => res.json())
	}

	orderCimpress(token, DocumentReferenceUrl) {
		var date = new Date();
		var time = date.getTime();
		var order_body = JSON.stringify({
			"PartnerOrderId": "partner"+ time,
			"CustomerId": "string",
			"Items": [
				{
					"Quantity": 1,
					"Sku": "VIP-9622",
					"DocumentReferenceUrl": DocumentReferenceUrl,
					"PartnerItemId": "string",
					"PartnerProductName": "string",
					"BusinessDays": 0
				}
			],
			"DestinationAddress": {
				"FirstName": "Marek",
				"LastName": "Zorvan",
				"MiddleName": "mz",
				"CompanyName": "string",
				"Phone": "string",
				"PhoneExtension": "string",
				"AddressLine1": "string",
				"AddressLine2": "string",
				"City": "string",
				"StateOrRegion": "string",
				"PostalCode": "string",
				"CountryCode": "SK",
				"County": "string"
			},
			"DeliveryOptionId": "string",
			"BusinessDays": 0,
			"Metadata": "string",
			"ShippingLabelDetail": {
				"MerchantDisplayName": "string",
				"ReturnAddress": {
					"CompanyName": "string",
					"Email": "string",
					"Phone": "string"
				}
			}
		});

		this.headers.append('Authorization','Bearer '+token);
		return this.http.post('https://api.cimpress.io/sandbox/vcs/printapi/v2/remediation/freeorders', order_body, {headers: this.headers})
			.map(res => res.json())
	}

	thankyou(params) {
		return this.http.post(api_url+'/order/thankyou', params, {headers: this.headers})
				.map(res => res.json())
	}
}
