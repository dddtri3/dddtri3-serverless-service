# dddtri3-serverless-service





<h1>Pre-Condition</h1>
npm install -g serverless</br>
npm install --save-dev serverless-pseudo-parameters</br>


<h1>To Deploy</h1>
git clone git@github.com:dddtri3/dddtri3-serverless-service.git</br>
serverless deploy --stage dev

<h1>To Remove</h1>
serverless remove --stage dev

<h1>Endpoints</h1>
<h2>Post: /v1/students</h2>
<h3>body sample</h3>
{
  "name": "Coco",
  "gender": "M"
}

<h2>Get:  /v1/students</h2>


<h2>DELETE: /v1/students/{name}</h2>
