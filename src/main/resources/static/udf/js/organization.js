function getOrganizationOptionsHTML(organizationName) {
    var organization_options = "";
    var organizations = webRequest('/self-and-inferior-organizations', 'GET', false);
    organizations.forEach(function (org) {
        var selected_flag = '';
        if (org['name'] === organizationName) {
            selected_flag = '" selected="selected';
        }
        organization_options += '<option value="' + org['id'] + selected_flag + '">' + org['name'] + '</option>';
    });
    return organization_options;
}
