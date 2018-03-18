<!DOCTYPE html>
<html>
<head>
	<title>Menu</title>
	<link rel="stylesheet" href="css/menu.css">
	<link rel="stylesheet" href="css/reset.css">
	<link rel="stylesheet" href="css/global.css">
	<link rel="stylesheet" href="ionicons/css/ionicons.css">
	<link href="https://fonts.googleapis.com/css?family=Lato:100,300,400,700,900&amp;subset=latin-ext" rel="stylesheet">
</head>
<body>
	
	<nav id="top-bar">
		<div class="container">
			<ul class="topbar-actions">
				<li class="ref-home selected">
					<a href="#" class="topbar-icon home"><span></span></a>
				</li>
				<li class="ref-search">
					<a href="#" class="topbar-icon search"><span></span></a>
					<input type="text" placeholder="Search..." name="search-box">
				</li>
				<li class="heading"><h1 class="topbar-icon logo"><span></span></h1></li>
				<li class="ref-messages"><a href="#" class="topbar-icon messages"><span></span></a></li>
				<li class="ref-notifications"><a href="#" class="topbar-icon notifications"><span></span></a></li>
				<li class="ref-profile">
					<a href="#" class="topbar-icon-profile">
						<img src="placeholders/ty.jpg" alt="Profile and settings">
					</a>
					<div class="topbar-dropdown">
						<span class="arrow"></span>
						<ul class="dropdown-items">
							<li class="topbar-dropdown-heading"><a href="#myprofile">
								<span>Name Surname<span>username</span></span>
							</a></li>
							<li><a href="#settings" class="topbar-icon default"><span>Settings</span></a></li>
							<li><a href="#logout" class="topbar-icon default"><span>Logout</span></a></li>
						</ul>
					</div>
				</li>
			</ul>

		</div>
	</nav>


	<script src="js/jquery-3.2.1.min.js"></script>
	<script src="js/main.js"></script>
</body>
</html>