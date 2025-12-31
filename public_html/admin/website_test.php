<?php
	require_once("header.php");
	@include_once("../res/blog.inc.php");
	if (!isset($_SESSION)) {
		session_start();
	}
?>
<div id="imAdminPage">
	<div id="imBody">
		<div class="imContent">
<?php
			$testedFolders = array();
			$test = new imTest();
			$test->doTest(true, $test->php_version_test(), l10n('admin_test_version') . ": " . PHP_VERSION, l10n('admin_test_version_suggestion'));
			$test->doTest(true, $test->session_test(), l10n('admin_test_session'), l10n('admin_test_session_suggestion'));

			@chdir("../.");
			// Site root folder
			if (isset($imSettings['general']['public_folder'])) {
				$testedFolders[] = $imSettings['general']['public_folder'];
				$test->doTest(true, $test->writable_folder_test($imSettings['general']['public_folder']), l10n('admin_test_folder') . ($imSettings['general']['public_folder'] != "" ? " (" . $imSettings['general']['public_folder'] . ")": " (site root folder)"), l10n("admin_test_folder_suggestion"));
			}

			// Blog public folder
			if (isset($imSettings['blog']) && $imSettings['blog']['sendmode'] == 'file' && !in_array($imSettings['blog']['folder'], $testedFolders)) {
				$testedFolders[] = $imSettings['blog']['folder'];
				$test->doTest(true, $test->writable_folder_test($imSettings['blog']['folder']), l10n('admin_test_folder') . ($imSettings['blog']['folder'] != "" ? " (" . $imSettings['blog']['folder'] . ")": " (site root folder)"), l10n("admin_test_folder_suggestion"));
			}
			
			// Guestbooks public folder
			if (isset($imSettings['guestbooks'])) {
				foreach($imSettings['guestbooks'] as $gb) {
					if ($gb['sendmode'] == 'file') {
						// Check this folder only if it's different from the blog's one
						if (!in_array($gb['folder'], $testedFolders)) {
							$testedFolders[] = $gb['folder'];
							$test->doTest(true, $test->writable_folder_test($gb['folder']), l10n('admin_test_folder') . ($gb['folder'] != "" ? " (" . $gb['folder'] . ")" :  " (site root folder)"), l10n("admin_test_folder_suggestion"));
						}
					}
				}			
			}
			if (isset($imSettings['dynamicobjects'])) {
				foreach($imSettings['dynamicobjects'] as $objId => $obj) {
					if (isset($obj['folder']) && !in_array($obj['folder'], $testedFolders)) {
						$testedFolders[] = $obj['folder'];
						$test->doTest(true, $test->writable_folder_test($obj['folder']), l10n('admin_test_folder') . ($obj['folder'] != "" ? " (" . $obj['folder'] . ")" :  " (site root folder)"), l10n("admin_test_folder_suggestion"));
					}
				}			
			}
			@chdir("admin");

			// Databases
			if (isset($imSettings['databases'])) {
				foreach($imSettings['databases'] as $db) {
					$tst = $test->mysql_test($db['host'], $db['user'], $db['password'], $db['database']);
					$test->doTest(true, $tst, l10n('admin_test_database') . " (" . $db['description'] . ")", l10n("admin_test_database_suggestion"));
				}
			}
			 
			if (isset($_POST['send'])) {
				$attachment = array();
				if (is_uploaded_file($_FILES['attachment']['tmp_name']) && file_exists($_FILES['attachment']['tmp_name'])) {
					$attachment = array(array(
						"name" => $_FILES['attachment']['name'],
						"mime" => $_FILES['attachment']['type'],
						"content" => file_get_contents($_FILES['attachment']['tmp_name'])
					));
				}
				$mailer = new ImSendEmail();
				if ($_POST['type'] == 'phpmailer' || $_POST['type'] == 'phpmailer-smtp') {
					$mailer->emailType = 'phpmailer';
					if ($_POST['type'] == 'phpmailer-smtp') {
						$mailer->use_smtp = true;
						$mailer->smtp_host = $_POST['smtphost'];
						$mailer->smtp_encryption = $_POST['smtpencryption'];
						if (@$_POST['smtpauth'] == "1") {
							$mailer->use_smtp_auth = true;
							$mailer->smtp_username = $_POST['smtpusername'];
							$mailer->smtp_password = $_POST['smtppassword'];
						}
					}					
				} else {
					$mailer->emailType = $_POST['type'];
				}
				$result = $mailer->send($_POST['from'], $_POST['to'], $_POST['subject'], strip_tags($_POST['body']), nl2br($_POST['body']), $attachment);

				// Save the test data for this session
				$_SESSION['form_test_type'] = $_POST['type'];
				$_SESSION['form_test_from'] = $_POST['from'];
				$_SESSION['form_test_to'] = $_POST['to'];
				$_SESSION['form_test_subject'] = $_POST['subject'];
				$_SESSION['form_test_body'] = $_POST['body'];
				$_SESSION['form_test_smtphost'] = $_POST['smtphost'];
				$_SESSION['form_test_smtpport'] = $_POST['smtpport'];
				$_SESSION['form_test_smtpencryption'] = $_POST['smtpencryption'];
				$_SESSION['form_test_smtpauth'] = @$_POST['smtpauth'];
				$_SESSION['form_test_smtpusername'] = $_POST['smtpusername'];
				echo "<script>window.top.location.href = 'website_test.php?result=" . ($result ? 1 : 0) . "';</script>";
				exit();
			}
?>
		</div>
		<div class="imContent" style="margin-top: 15px; padding: 5px;">
			<h2 style="margin: 5px 0 15px 0; text-align: center;"><?php echo l10n('admin_test_email', 'Email form test'); ?></h2>
			<script type="text/javascript">
			function onMethodChange() {
				var attachment = $( '#attachment, [for=attachment]' ),
					val = $( "#type" ).val();

				// SMTP fields
				if ( val == 'phpmailer-smtp' ) {
					$( '.smtp' ).css( "display", "block" );
					$( '.smtp-auth' ).css( "display", $("#smtpauth").prop("checked") ? "table-row" : "none" );
				} else {
					$( '.smtp, .smtp-auth' ).css( "display", "none" );
				}

				// Hide the attachment field
				if ( val == 'text' ) {
					attachment.val('').css( "display", "none" );
				} else {
					attachment.css( "display", "block" );
				}
			}
			function downloadScript() {
				document.location.href = "download.php?what=" + $(this).val();
			}
			$( document ).ready(function () {
				if ( !!'<?php echo htmlentities(@$_SESSION["form_test_type"]) ?>' ) {
					$( "#type" ).val( '<?php echo htmlentities(@$_SESSION["form_test_type"]) ?>' );
				}
				if ( !!'<?php echo htmlentities(@$_SESSION["form_test_smtpencryption"]) ?>' ) {
					$( "#smtpencryption" ).val( '<?php echo htmlentities(@$_SESSION["form_test_smtpencryption"]) ?>' );
				}
				if ( '<?php echo htmlentities(@$_SESSION["form_test_smtpauth"]) ?>' == '1' ) {
					$( "#smtpauth" ).prop( "checked", true );
				}
				onMethodChange();
			});
			</script>
			<form action="website_test.php" method="post" enctype="multipart/form-data">
				<table class="email-test">
					<tr>
						<td style="vertical-align: middle;">
							<label for="type"><?php echo l10n('form_script_type'); ?></label>
						</td>
						<td>
							<!-- enable disable the attachment field basing on the email type -->
							<select name="type" id="type" onchange="onMethodChange.apply(this)">
								<option value="phpmailer"><?php echo l10n('form_script_type_phpmailer', 'PHP Mailer'); ?></option>
								<option value="phpmailer-smtp"><?php echo l10n('form_script_type_phpmailer_smtp', 'PHP Mailer (SMTP)'); ?></option>
								<option value="html"><?php echo l10n('form_script_type_html'); ?></option>
								<option value="html-x"><?php echo l10n('form_script_type_html_x'); ?></option>
								<option value="text"><?php echo l10n('form_script_type_text'); ?></option>
							</select>
							<a href="#" onclick="downloadScript.apply(document.getElementById('type'))"><?php echo l10n("admin_download", "Download") ?></a>
						</td>
					</tr>
				</table>
				<fieldset class="smtp">
					<legend>SMTP</legend>
					<table class="email-test">
						<tr>
							<td>
								<label for="smtphost"><?php echo l10n('form_smtphost', "Host:"); ?></label>
							</td>
							<td>
								<input type="text" name="smtphost" id="smtphost" value="<?php echo htmlentities(@$_SESSION['form_test_smtphost']) ?>"/>
							</td>
						</tr>
						<tr>
							<td>
								<label for="smtpport"><?php echo l10n('form_smtpport', "Port:"); ?></label>
							</td>
							<td>
								<input type="text" name="smtpport" id="smtpport" value="<?php echo htmlentities(@$_SESSION['form_test_smtpport']) ?>"/>
							</td>
						</tr>
						<tr>
							<td>
								<label for="smtpencryption"><?php echo l10n('form_smtpencryption', "Encryption type:"); ?></label>
							</td>
							<td>
								<select name="smtpencryption" id="smtpencryption">
									<option value="none">None</option>
									<option value="ssl">SSL</option>
									<option value="tls">TLS</option>
								</select>
							</td>
						</tr>
						<tr>
							<td colspan="2">
								<input type="checkbox" name="smtpauth" id="smtpauth" onchange="onMethodChange.apply(this)" value="1" <?php if (@$_SESSION['form_test_smtpauth']=='1') "checked" ?>/>
								<label for="smtpauth"><?php echo l10n('form_smtpauth', "Use Authentication"); ?></label>
							</td>
						</tr>
						<tr class="smtp-auth">
							<td>
								<label for="smtpusername"><?php echo l10n('form_smtpusername', "Username:"); ?></label>
							</td>
							<td>
								<input type="text" name="smtpusername" id="smtpusername" value="<?php echo htmlentities(@$_SESSION['form_test_smtpusername']) ?>"/>
							</td>
						</tr>
						<tr class="smtp-auth">
							<td>
								<label for="smtppassword"><?php echo l10n('form_smtppassword', "Password:"); ?></label>
							</td>
							<td>
								<input type="password" name="smtppassword" id="smtppassword"/>
							</td>
						</tr>
					</table>
				</fieldset>
				<table class="email-test">
					<tr>
						<td>
							<label for="from"><?php echo l10n('form_from'); ?></label>
						</td>
						<td>
							<input type="text" name="from" id="from" value="<?php echo htmlentities(@$_SESSION['form_test_from']) ?>"/>
						</td>
					</tr>
					<tr>
						<td>
							<label for="to"><?php echo l10n('form_to'); ?></label>
						</td>
						<td>
							<input type="text" id="to" name="to" value="<?php echo htmlentities(@$_SESSION['form_test_to']) ?>"/>
						</td>
					</tr>
					<tr>
						<td>
							<label for="subject"><?php echo l10n('form_subject'); ?></label>
						</td>
						<td>
							<input type="text" id="subject" name="subject" value="<?php echo htmlentities(@$_SESSION['form_test_subject']) ?>"/>
						</td>
					</tr>
					<tr>
						<td colspan="2">
							<textarea name="body" id="body" style="width: 99%;" rows="10"><?php echo htmlentities(@$_SESSION['form_test_body']) ?></textarea>	
						</td>
					</tr>
					<tr>
						<td>
							<label for="attachment"><?php echo l10n('form_attachment', 'Attachment: '); ?></label>
						</td>
						<td>
							<input type="file" name="attachment" id="attachment"/>
						</td>
					</tr>
				</table>
				<div style="text-align: center; margin-top: 10px;">
					<input type="submit" value="<?php echo l10n('form_submit'); ?>" name="send">
					<input type="reset" value="<?php echo l10n('form_reset'); ?>">	
				</div>				
			</form>
			<script>$(document).ready(function () { $("#from").focus(); });</script>
<?php 
?>
		</div>
<?php
	$path = pathCombine(array("../", $imSettings['general']['public_folder'], "email_log.txt"));
	if (file_exists($path) && function_exists("file_get_contents")): ?>
		<div class="imContent" style="margin-top: 15px; padding: 5px;">
			<h2>Email Log</h2>
			<textarea readonly="true" style="width: 99%; height: 200px; padding: 5px 3px;"><?php echo file_get_contents($path) ?></textarea>
		</div>
<?php endif; ?>
	</div>
</div>
<?php
require_once("footer.php");
?>
