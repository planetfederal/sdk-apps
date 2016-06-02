#!/bin/sh
# Run from repo root level

mkdir archive/

# Quickview:
# Build quickview war
COMPONENT=quickview
cd $WORKSPACE/$COMPONENT
npm i
npm run package <<< "quickview.war"
mv quickview.war ../archive

# Build quickview RPM
cd $WORKSPACE/rpmbuild
for dir in BUILD BUILDROOT RPMS SOURCE SPECS SRPMS SRC
do
 [[ -d $WORKSPACE/rpmbuild/$COMPONENT/$dir ]] && rm -Rf $WORKSPACE/rpmbuild/$COMPONENT/$dir
  mkdir -p $WORKSPACE/rpmbuild/$COMPONENT/$dir
done
cp SPECS/${COMPONENT}.spec $COMPONENT/SPECS
mkdir -p $COMPONENT/SRC/usr/share/boundless/$COMPONENT
unzip ../archive/quickview.war -d $COMPONENT/SRC/usr/share/boundless/$COMPONENT
mkdir -p $COMPONENT/SRC/etc/tomcat8/Catalina/localhost/
cp tomcat-context/${COMPONENT}.xml $COMPONENT/SRC/etc/tomcat8/Catalina/localhost/

find $WORKSPACE/rpmbuild/$COMPONENT/SRC/ -type f | sed "s|$WORKSPACE/rpmbuild/$COMPONENT/SRC||" | awk -F\\ '{print "\""$1"\""}' >> $WORKSPACE/rpmbuild/$COMPONENT/SPECS/$COMPONENT.spec
rpmbuild -ba --define "_topdir $WORKSPACE/rpmbuild/$COMPONENT" --define "_WORKSPACE $WORKSPACE/rpmbuild/$COMPONENT" --buildroot $WORKSPACE/rpmbuild/$COMPONENT/BUILDROOT/ $WORKSPACE/rpmbuild/$COMPONENT/SPECS/$COMPONENT.spec

for i in `find $WORKSPACE/rpmbuild/ -name *.rpm`; do
  mv $i $WORKSPACE/archive/
done
