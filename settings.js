const settings = {
    "urls": ["http://192.168.16.212/api/v1/","http://10.182.255.2/api/v1/"],
    "api_fetch_interval_ms": 1000,
    "device_statuses": [
        {"status":"Valid", "color":"#00FF00"},
        {"status":"Missing", "color":"#FF0000"},
        {"status":"Offline", "color":"#B7B7B7"},
        {"status":"Alert", "color":"#FF9900"}
    ],
    "create_volume_success_msg": "A new volume was created successfully",
    "create_volume_failure_msg": "A new volume wasn't created successfully",
    "delete_volume_success_msg": "The volume was deleted successfully",
    "delete_volume_failure_msg": "The volume wasn't deleted successfully",
}