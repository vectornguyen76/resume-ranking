## Create Stack

aws cloudformation create-stack --stack-name server --template-body file://server.yml --parameters file://parameters.json --region us-east-1

## Delete Stack

aws cloudformation delete-stack --stack-name server --region us-east-1
