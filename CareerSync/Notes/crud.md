Create — addApplication, using push() for collision-free unique IDs
Read — subscribeToApplications, a live onValue listener with proper Object.entries() transformation, loading state, and empty state
Update — updateApplication, using update() instead of set() to avoid wiping untouched fields, with a single Modal correctly switching between add/edit mode via editingApp
Delete — deleteApplication, using remove(), gated behind a confirmation dialog