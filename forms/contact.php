<?php

if (
    !isset($_POST['name']) ||
    !isset($_POST['email']) ||
    !isset($_POST['subject']) ||
    !isset($_POST['message'])
) {
    http_response_code(400);
    echo "Missing form fields";
    exit;
}

$receiving_email_address = 'byteteomtech@gmail.com';

$php_email_form = '../assets/vendor/php-email-form/php-email-form.php';
if (!file_exists($php_email_form)) {
    http_response_code(500); 
    echo "Unable to load the 'PHP Email Form' library!";
    exit;
}
include($php_email_form);

$contact = new PHP_Email_Form;

$contact->ajax = true;

$contact->to = $receiving_email_address;
$contact->from_name = $_POST['name'];
$contact->from_email = $_POST['email'];
$contact->subject = $_POST['subject'];

$contact->add_message($_POST['name'], 'From');
$contact->add_message($_POST['email'], 'Email');
$contact->add_message($_POST['message'], 'Message', 10);

if ($contact->send()) {
    http_response_code(200); 
    echo "OK";
} else {
    http_response_code(500);
    echo "Form submission failed!";
}

?>
