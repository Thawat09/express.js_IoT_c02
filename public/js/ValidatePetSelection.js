function ValidatePetSelection() {
    var checkboxes = document.getElementsByName("pinMQTT");
    var numberOfCheckedItems = 0;
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked)
            numberOfCheckedItems++;
    }
    if (numberOfCheckedItems > 1) {
        return false;
    }
}