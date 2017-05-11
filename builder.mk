#
# makefile used on the builder at shanoir-2016.irisa.fr
#

# designed to build all images from scratch


# keycloak images
#
# https://github.com/fli-iam/shanoir-ng/wiki/Installation-guide-3%29-Docker-Keycloak

keycloak-mysql:
	(cd shanoir-ng-keycloak/dockers/mysql && docker build -t shanoir-ng/keycloak-mysql .)

keycloak:
	(cd shanoir-ng-keycloak-init && mvn package)
	(cd shanoir-ng-keycloak/dockers/keycloak/ && docker build -t shanoir-ng/keycloak .)

	# prepare the package for the other containers
	(cd shanoir-ng-users/ && mvn install -Pinit-keycloak)
	(cd shanoir-ng-keycloak && mvn package)

# base image for the microservices
base-ms-image:
	docker build -t shanoir-ng/debianjava8mariadb:latest shanoir-ng-template/DockerWithJdk8AndMariaDb

# shanoir-ng-users
users: base-ms-image
	# https://github.com/fli-iam/shanoir-ng/wiki/Installation-guide-4%29-Docker-shanoir-ng-users
	(cd shanoir-ng-users/ && mvn clean package docker:build -DskipTests -Pqualif)

# shanoir-ng-nginx
#
# https://github.com/fli-iam/shanoir-ng/wiki/Installation-guide-6%29-Docker-Nginx-with-statics
nginx: keycloak users
	npm set registry https://registry.npmjs.org

	# FIXME: is -Pqualif still needed ?
	(cd shanoir-ng-front && mvn package -Pqualif)
	(cd shanoir-ng-nginx && docker build -t shanoir-ng/nginx:latest .)

