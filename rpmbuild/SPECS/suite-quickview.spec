%define __spec_install_pre /bin/true

Name: suite-quickview
Version: 4.9.0rc
Release: REPLACE_RELEASE
Summary: Boundless WebSDK demo application
Group: Applications/Engineering
License: LGPL
URL: http://boundlessgeo.com/
BuildRoot: %{_WORKSPACE}/BUILDROOT
Requires(post): bash
Requires(preun): bash
Requires:  unzip, suite-geoserver >= 4.9.0, suite-geoserver < 4.9.1
AutoReqProv: no

%define _rpmdir /var/jenkins/workspace/sdkApps-quickview/archive/
%define _rpmfilename %%{NAME}-%%{VERSION}-%%{RELEASE}.%%{ARCH}.rpm
%define _unpackaged_files_terminate_build 0
# Don't waste time re-packing jars (http://makewhatis.com/2011/12/remove-unwanted-commpression-in-during-rpmbuild-for-jar-files)
%define __os_install_post %{nil}


%description
Boundless Spatial WebSDK demo application

%prep

%install
mv %{_WORKSPACE}/SRC/* %{_WORKSPACE}/BUILDROOT/

%pre

%post
chown -R root:root /opt/boundless/

%preun

%postun
for dir in `find /opt/boundless/suite/quickview -type d -exec bash -c '[ "x\`find "{}" -maxdepth 1 -type f\`" = x ] && echo "{}"' \; | sort -r`; do
  rm -rf $dir
done

%files
%defattr(-,root,root,-)
