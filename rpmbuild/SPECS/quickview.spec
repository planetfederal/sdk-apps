%define __spec_install_pre /bin/true

Name: quickview
Version: 4.9.0
Release: REPLACE_RELEASE
Summary: Boundless WebSDK demo application
Group: Applications/Engineering
License: LGPL
URL: http://boundlessgeo.com/
BuildRoot: %{_WORKSPACE}/BUILDROOT
Requires(post): bash
Requires(preun): bash
Requires:  unzip, suite-geoserver
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
chown -R tomcat8:tomcat8 /usr/share/boundless/

%preun

%postun

%files
%defattr(-,tomcat8,tomcat8,-)
