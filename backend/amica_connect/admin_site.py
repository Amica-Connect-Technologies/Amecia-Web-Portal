from django.contrib.admin import AdminSite
from django.utils.translation import gettext_lazy as _

class ArnicaConnectAdminSite(AdminSite):
    site_header = _('Arnica Connect Administration')
    site_title = _('Arnica Connect Admin Portal')
    index_title = _('Dashboard')
    site_url = '/'
    
    def get_app_list(self, request):
        """
        Return a sorted list of all the installed apps that have been
        registered in this site.
        """
        app_dict = self._build_app_dict(request)
        
        # Sort the apps alphabetically
        app_list = sorted(app_dict.values(), key=lambda x: x['name'].lower())
        
        # Sort the models alphabetically within each app
        for app in app_list:
            app['models'].sort(key=lambda x: x['name'])
        
        return app_list

# Create custom admin site instance
admin_site = ArnicaConnectAdminSite(name='arnica_connect_admin')