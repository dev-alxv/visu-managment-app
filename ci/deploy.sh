#!/bin/sh
for ARGUMENT in "$@"
do

    KEY=$(echo $ARGUMENT | cut -f1 -d=)
    VALUE=$(echo $ARGUMENT | cut -f2 -d=)

    case "$KEY" in
            ACCESS_KEY)              ACCESS_KEY=${VALUE} ;;
            ACCESS_SECRET)           ACCESS_SECRET=${VALUE} ;;
            BUCKET)                  BUCKET=${VALUE} ;;
            HOOK)                    HOOK=${VALUE} ;;
            *)
    esac


done

export AWS_ACCESS_KEY_ID=$ACCESS_KEY
export AWS_SECRET_ACCESS_KEY=$ACCESS_SECRET
export AWS_DEFAULT_REGION="eu-central-1"
aws s3 cp ./visualization-managment-frontend.tgz s3://$BUCKET/visualization-managment-frontend.tgz
if [ ! -z "$HOOK" ];
then
  curl -k --data "token=HA.bw69aR-4BcfQ8:Z&hook=$HOOK&arguments=" https://release.immoviewer.com
fi
