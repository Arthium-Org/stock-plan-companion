// Single source of truth for the registration form's backend endpoint.
//
// Deployment invariant (D-09, RESEARCH Pitfall 5): this URL is a Google Apps
// Script Web App "/exec" deployment. All future script edits MUST go through
// "Manage deployments -> Edit -> select new version -> Deploy" on this SAME
// deployment. Using "New deployment" instead mints a brand-new URL/deployment
// id, silently orphaning this constant (submissions would stop reaching the
// updated script with no error visible on the frontend).
//
// The frontend holds only the Web App URL — the Google Sheet it writes to is
// encapsulated entirely inside the Apps Script (D-02); no Sheet id lives here.

export const appsScriptUrl =
	'https://script.google.com/macros/s/AKfycbzM9m0uesrhpzZzDl9mBcpePQx3S8WUfbsyZAVfPcJPxaiId1vxmc31Tge5GmzsZhPi2w/exec';
