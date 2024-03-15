<?php

class PHP_Email_Form {
    public $to;
    public $from_name;
    public $from_email;
    public $subject;
    public $message;
    public $headers;
    public $ajax;

    public function __construct() {
        $this->ajax = false;
    }

    public function add_message($content, $label = '') {
        if ($label) {
            $this->message .= "<p><strong>$label:</strong> $content</p>";
        } else {
            $this->message .= "<p>$content</p>";
        }
    }

    public function send() {
        $this->headers = "From: $this->from_name <$this->from_email>" . "\r\n";
        $this->headers .= "Reply-To: $this->from_email" . "\r\n";
        $this->headers .= "Content-type: text/html" . "\r\n";

        if (mail($this->to, $this->subject, $this->message, $this->headers)) {
            return true;
        } else {
            return false;
        }
    }
}

?>
