<!DOCTYPE html>
<html>
<head>
	<title>Login</title>
	<link rel="stylesheet" href="css/form.css">
	<link rel="stylesheet" href="css/reset.css">
	<link rel="stylesheet" href="css/global.css">
	<link rel="stylesheet" href="ionicons/css/ionicons.css">
	<link href="https://fonts.googleapis.com/css?family=Lato:100,300,400,700,900&amp;subset=latin-ext" rel="stylesheet">
</head>
<body>

	<div id="notifications">
		<div class="notification error">
			<span>A notification just popped up.</span>
			<span class="close-btn"></span>
		</div>
	</div>

	<div id="login-form">
		<div class="log-side">
			<span class="logo-icon">Laces</span>
		</div>
		<div class="log-container">
			<header>
				<h1>Login</h1>
			</header>
			<form action="#" class="form-login">
				<ul class="form-login-list">
					<li>
						<input type="text" name="username">
						<label for="username">Username</label>
						<span class="error-msg">An error occured while proceeding.</span>
						<input type="password" name="password">
						<label for="password">Password</label>
						<span class="error-msg">An error occured while proceeding.</span>
					</li>
					<button type="submit" class="form-button-login">Login</button>
				</ul>
				<footer>
					<a class="form-button-lostpwd" href="#"><span>Forgot Password?</span></a>
					<a class="form-button-lostpwd" href="#"><span>Dont have an account yet?</span></a>
				</footer>
			</form>
		</div>
	</div>
	
	<script src="js/jquery-3.2.1.min.js"></script>
	<script src="js/main.js"></script>
</body>
</html>