import requests
import json
import urllib2
import urllib
import pymongo
from pymongo import MongoClient

client=MongoClient('localhost',27017)
db=client.MRPO

url = 'http://www.truemd.in/api/medicine_suggestions/?key=dd961c03da6757bcd6b03612573dc7&limit=50&id='
data = '{"query":{"bool":{"must":[{"text":{"record.document":"SOME_JOURNAL"}},{"text":{"record.articleTitle":"farmers"}}],"must_not":[],"should":[]}},"from":0,"size":50,"sort":[],"facets":{}}'
hdr = {'User-Agent': 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.27 Safari/537.17','accept':'*/*','Content-Encoding':'gzip'}

search_strings=['A','B','C','D','E','F','G','H','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
medicine_names=[]


new_url='http://www.truemd.in/api/medicine_details'


for search_char in search_strings:
	url=url+search_char
	req = urllib2.Request(url,headers=hdr)
	web_response = urllib2.urlopen(req)
	readable_page = web_response.read()
	json_data = json.loads(readable_page)
	medicines=json_data['response']['suggestions']
	for i in range(len(medicines)):
		medicine_names.append(medicines[i]['suggestion'])

# print len(medicine_names)

# print medicine_names
for medicine in medicine_names:
	params={'key':'dd961c03da6757bcd6b03612573dc7','id':medicine}
	data=urllib.urlencode(params)
	data=data.encode('utf-8')
	req1 = urllib2.Request(new_url,data=data,headers=hdr)
	web_response1 = urllib2.urlopen(req1)
	readable_page1 = web_response1.read()
	json_data_medicine = json.loads(readable_page1)
	db.medicines.insert(json_data_medicine['response'])
	# print('ok')
	# print(json_data_medicine['response'])
print("Insertion into DB Completed")
